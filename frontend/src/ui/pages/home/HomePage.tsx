import { Button } from "@/ui/components/button";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      dasdada
      <Button onClick={() => navigate("/")}>Logout</Button>
    </div>
  );
}
