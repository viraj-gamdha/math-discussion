import { Discussion } from "@/models/discussion.js";
import { IDiscussion } from "@/types/discussion";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { Types } from "mongoose";

export const getAllDiscussions = TryCatch(async (req, res, next) => {
  const discussions = await Discussion.find()
    .populate("author", "username")
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: "Discussions fetched successfully",
    data: discussions,
  });
});

// Creating a post
export const addStartingNumber = TryCatch<{ value: number }>(
  async (req, res, next) => {
    const { value } = req.body;
    const userId = req.user?.id as string;

    const discussion = new Discussion({
      value,
      isStartingNumber: true,
      author: userId,
    });

    await discussion.save();
    await discussion.populate("author", "username");

    return res.status(201).json({
      success: true,
      message: "Starting number created successfully",
      data: discussion,
    });
  }
);

// Growing the node tree
export const addOperation = TryCatch<IDiscussion>(async (req, res, next) => {
  const { operation, rightOperand, parentId } = req.body;
  const userId = req.user?.id as string;

  if (rightOperand === undefined || rightOperand === null) {
    return next(new ErrorHandler(400, "Right operand required"));
  }

  // Get the parent node
  const parentNode = await Discussion.findById(parentId);
  if (!parentNode) {
    return next(new ErrorHandler(404, "Parent node not found"));
  }

  // Calculate the new value
  let newValue;
  switch (operation) {
    case "+":
      newValue = parentNode.value + rightOperand;
      break;
    case "-":
      newValue = parentNode.value - rightOperand;
      break;
    case "*":
      newValue = parentNode.value * rightOperand;
      break;
    case "/":
      if (rightOperand === 0) {
        return next(new ErrorHandler(400, "Division by zero is not allowed"));
      }
      newValue = parentNode.value / rightOperand;
      break;
    default:
      return next(new ErrorHandler(400, "Invalid operation"));
  }

  // Create the new operation node
  const discussion = new Discussion({
    value: newValue,
    operation,
    rightOperand,
    parentId,
    author: userId,
    isStartingNumber: false,
  });

  await discussion.save();
  await discussion.populate("author", "username");

  return res.status(201).json({
    success: true,
    message: "Operation added successfully",
    data: discussion,
  });
});

export const deleteDiscussion = TryCatch<{}, { id: string }>(
  async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user?.id as string;

    // Find the discussion node
    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return next(new ErrorHandler(404, "Discussion not found"));
    }

    // Check if user is the author (for authorization)
    if (discussion.author.toString() !== userId) {
      return next(new ErrorHandler(400, "You can only delete your own post"));
    }

    // Recursive function to delete all children
    const deleteWithChildren = async (nodeId: Types.ObjectId) => {
      // Find all children of this node
      const children = await Discussion.find({ parentId: nodeId });

      // Recursively delete all children
      for (const child of children) {
        await deleteWithChildren(child._id);
      }

      // At end Delete the current node
      await Discussion.findByIdAndDelete(nodeId);
    };

    // Start deletion from the requested node
    await deleteWithChildren(discussion._id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: null,
    });
  }
);
