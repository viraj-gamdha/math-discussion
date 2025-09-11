import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/components/ui/toast";
import {
  useAddStartingNumberMutation,
  useGetDiscussionsQuery,
} from "@/redux/apis/discussionApiSlice";
import { FormInput } from "@/components/ui/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import s from "./home.module.scss";
import { parseError } from "@/utils/helpers";
import {
  startingNumberSchema,
  type StartingNumberFormData,
  type Discussion,
  type TreeNode,
} from "@/types/discussion";
import DiscussionNode from "@/components/page/home/discussion-node";

const Home = () => {
  const { data: discussions } = useGetDiscussionsQuery();
  const [addStartingNumber] = useAddStartingNumberMutation();

  // Form setup for starting number
  const startingNumberForm = useForm<StartingNumberFormData>({
    resolver: zodResolver(startingNumberSchema),
    defaultValues: {
      value: 0,
    },
  });

  // Handle starting number submission
  const handleStartingNumber = async (data: StartingNumberFormData) => {
    try {
      const res = await addStartingNumber(data).unwrap();
      if (res.success) {
        successToast(res.message);
        startingNumberForm.reset();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  // Build tree structure for nested display
  const buildTree = (nodes: Discussion[]): TreeNode[] => {
    const nodeMap: Record<string, TreeNode> = {};
    const roots: TreeNode[] = [];

    // First pass: create all nodes with children
    nodes.forEach((node) => {
      nodeMap[node._id as string] = { ...node, children: [] };
    });

    // Second pass: build tree structure
    nodes.forEach((node) => {
      if (node.parentId) {
        const parent = nodeMap[node.parentId];
        if (parent) {
          // push its children nodes in it..
          parent.children!.push(nodeMap[node._id as string]);
        }
      } else {
        roots.push(nodeMap[node._id as string]);
      }
    });

    return roots;
  };

  const treeData = discussions?.data ? buildTree(discussions.data) : [];

  // console.log(discussions?.data,"VS", treeData)

  return (
    <div className={s.container}>
      {/* Starting number form (create) */}
      <form
        className={s.create_form}
        onSubmit={startingNumberForm.handleSubmit(handleStartingNumber)}
      >
        <h4>Create a new post</h4>
        <div className={s.form_fields}>
          <FormInput
            form={startingNumberForm}
            id="value"
            label="Starting Number"
            type="number"
          />
          <Button type="submit" variant="primary">
            +Create
          </Button>
        </div>
      </form>

      {/* Tree nodes display */}
      <div className={s.tree_container}>
        {treeData.map((node) => (
          <DiscussionNode
            key={node._id}
            node={node}
            type={node.isStartingNumber ? "starting" : "operation"}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
