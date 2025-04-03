import { useContext } from "react";
import { FlowValidationContext } from "../context/FlowValidtionContext";

export default function useFlowValidation() {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error(
      "useFlowValdation must be used within a FlowValidationContext"
    );
  }
  return context;
}
