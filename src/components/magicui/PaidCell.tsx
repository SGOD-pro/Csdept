import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { togglePaid } from "@/hooks/FormSubmit";
import {Result} from "@/hooks/FormSubmit"
interface PaidCellProps {
  data: Result;
}

const PaidCell: React.FC<PaidCellProps> = ({ data }) => {
  const [disable, setDisable] = React.useState(false);

  const paid = async (e: boolean) => {
    setDisable(true);
    data.isPaid = await togglePaid(data.docId, e);
    setDisable(false);
  };

  return (
    <Switch
      checked={data.isPaid}
      onCheckedChange={paid}
      disabled={disable}
    />
  );
};

export default PaidCell;
