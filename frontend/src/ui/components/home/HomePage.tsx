import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function HomePage() {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/")}>Logout</Button>
    </div>
  );
}
