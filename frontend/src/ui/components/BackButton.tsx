import { ArrowLeft } from "lucide-react";
import { Button } from "./shadcn/button";
import { useNavigate } from "react-router";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => {
        navigate(-1);
      }}
      className="mb-4 cursor-pointer"
      size="icon-sm"
    >
      <ArrowLeft />
    </Button>
  );
}

export default BackButton;
