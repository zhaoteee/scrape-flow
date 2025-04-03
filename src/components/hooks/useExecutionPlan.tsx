import FlowToExecutionPlan, {
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/FlowToExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import useFlowValidation from "./useFlowValidation";

const UseExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();
  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_IINPUTS:
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );
  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { exectionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );
    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return exectionPlan;
  }, [toObject, handleError]);
  return generateExecutionPlan;
};

export default UseExecutionPlan;
