import s from "./discussion-node.module.scss";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { errorToast, successToast } from "@/components/ui/toast";
import {
  useAddOperationMutation,
  useDeleteDiscussionMutation,
} from "@/redux/apis/discussionApiSlice";
import {
  operationSchema,
  type OperationFormData,
  type TreeNode,
} from "@/types/discussion";
import type { UserInfo } from "@/types/user";
import { parseError } from "@/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserCircle2, Trash2 } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";

type DiscussionNodeProps = {
  node: TreeNode;
  level?: number;
  type: "starting" | "operation";
};

const DiscussionNode = ({ node, level = 0, type }: DiscussionNodeProps) => {
  const [addOperation] = useAddOperationMutation();
  const [deleteDiscussion] = useDeleteDiscussionMutation();

  const form = useForm<OperationFormData>({
    resolver: zodResolver(operationSchema),
    defaultValues: {
      operation: "+",
      rightOperand: 0,
      parentId: node._id as string,
    },
  });

  const handleOperation = async (data: OperationFormData) => {
    try {
      const res = await addOperation({
        ...data,
        parentId: node._id as string,
      }).unwrap();
      if (res.success) {
        successToast(res.message);
        form.reset();
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this node and all its children?"
      )
    ) {
      return;
    }

    try {
      const res = await deleteDiscussion(node._id as string).unwrap();
      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <div className={s.container}>
      <div
        className={s.node_content}
        style={{
          marginLeft: level * 20,
          borderColor: type === "starting" ? "var(--color-primary)" : undefined,
        }}
      >
        <UserCircle2
          className={s.profile_icon}
          size={32}
          color="var(--color-border-d)"
        />

        <div className={s.node_details}>
          <div className={s.node_info}>
            <div className={s.info_wrapper}>
              <span className={s.author}>
                {(node?.author as UserInfo)?.username}
              </span>
              <span>{moment(node.createdAt).format("DD.MM.YYYY hh:mm A")}</span>
            </div>

            <div className={s.info_wrapper}>
              <span>
                {type === "starting"
                  ? `Starting Number: ${node.value}`
                  : `Result: ${node.value}`}
              </span>

              {type === "operation" && (
                <span>
                  Operation: {node.operation} {node.rightOperand}
                </span>
              )}
            </div>
          </div>

          <form onSubmit={form.handleSubmit(handleOperation)}>
            <FormInput
              form={form}
              id="operation"
              variant="select"
              label="Operation"
              options={[
                { value: "+", label: "+" },
                { value: "-", label: "-" },
                { value: "*", label: "×" },
                { value: "/", label: "÷" },
              ]}
            />
            <FormInput
              form={form}
              id="rightOperand"
              label="Value (Right Operand)"
              type="number"
            />
            <Button type="submit" variant="primary">
              Add Operation
            </Button>
          </form>
        </div>
        <Button variant="secondary" onClick={handleDelete}>
          <Trash2 size={16} />
        </Button>
      </div>
      {/* Nesting children */}
      {node.children?.map((child) => (
        <DiscussionNode
          key={child._id}
          node={child}
          level={level + 1}
          type="operation"
        />
      ))}
    </div>
  );
};

export default DiscussionNode;
