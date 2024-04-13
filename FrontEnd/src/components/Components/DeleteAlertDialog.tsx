import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "../ui/button";
import { Trash2Icon } from "lucide-react";
import { Device } from "../Pages/home";
import axios from "axios";
import { domain } from "@/constants";
import { Dispatch, SetStateAction } from "react";

interface DeleteAlertDialogProps {
  deviceId: string;
  setDevices: Dispatch<SetStateAction<Device[]>>;
}

const DeleteAlertDialog : React.FC<DeleteAlertDialogProps> = ({ deviceId, setDevices }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant="destructive"
          className="flex justify-start items-center gap-3 w-full h-full pl-2"
        >
          <Trash2Icon size={15}/>
          <p>Delete</p>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[1002]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this device and all of its data, including all sensors and their data.
            and no data will be stored in the database, untill you add the device again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={async () => {
              await axios.delete(`${domain}/api/v1/devices/${deviceId}`);
              setDevices((prevDevices : Device[]) => prevDevices.filter((device) => device.id !== deviceId));
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;