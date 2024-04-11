import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddDeviceFormSchema } from "@/zodSchemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from "../ui/alert-dialog";
import axios from "axios";
import { domain } from "@/constants";

interface AddDeviceFormProps {}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({}) => {
  const alertDialogAction = useRef<HTMLButtonElement>(null)
  const search = useRef<HTMLDivElement>(null);
  const [selectedSensors, setSelectedSensors] = useState<string[]>([])
  const [sensorName, setSensorName] = useState<string>("")
  const [sensors, setSensors] = useState<string[]>(["hi","hello","yo yo","sab thik","hi","hello","yo yo","sab thik"]);
  const getSensors = async (query : string) => {
    // const { data } = await axios.get(`${domain}/api/v1/sensors/${query}`);
    // setSensors(data);
    search.current?.classList.add("flex");
    search.current?.classList.remove("hidden");
  }
  const addSensor = (sensor: string) => {
    setSelectedSensors((prev) => [sensor, ...prev])
    setSensorName("")
  }
  const form = useForm<z.infer<typeof AddDeviceFormSchema>>({
    resolver: zodResolver(AddDeviceFormSchema),
    defaultValues: {
      deviceName: "",
      longitude: "0",
      latitude: "0",
      sensors: []
    }
  })
  useEffect(() => {
    const { submitCount, errors : { sensors, deviceName, latitude, longitude } } = form.formState;
    if (submitCount > 0 && sensors == undefined && deviceName == undefined && longitude == undefined && latitude == undefined) {
      alertDialogAction.current?.click()
    }
  }, [form.formState.submitCount])
  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target != search.current) {
        search.current?.classList.add("hidden");
        search.current?.classList.remove("flex");
      }
    })
  },[])
  const onSubmit = async(_values: z.infer<typeof AddDeviceFormSchema>) => {}
  return (
    <Form {...form}>
      <form
        id = "addDeviceForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField 
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Device Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Device Name"
                  {...field}
                />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between">
          <FormField 
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Longitude
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Longitude"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Latitude
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Latitude"
                    {...field}
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
        </div>
        <FormItem className="flex-grow">
          <FormLabel>
            Sensors
          </FormLabel>
          <FormControl>
            <div className="flex w-full gap-2 items-center">
              <Search/>
              <div className="flex-grow relative">
                <Input
                  type="text"
                  placeholder="Search Sensors"
                  value={sensorName}
                  onChange={(e) => {
                    const curr = e.target.value
                    setSensorName(curr)
                    getSensors(curr);
                  }}
                  onKeyUp={(e) => {
                    e.preventDefault()
                    if (e.key === "Enter") {
                      addSensor(sensorName)
                      form.setValue("sensors", selectedSensors)
                    }
                  }}
                />
                <div className={`absolute top-[100%] w-full max-h-[100px] flex flex-col border-black border-solid rounded bg-white  overflow-x-auto ${sensors.length != 0 ? "border-2 p-2" : ""}`} ref={search}>
                  {sensors.map((sensor, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        addSensor(sensor);
                        form.setValue("sensors", selectedSensors)
                        search.current?.classList.add("hidden");
                        search.current?.classList.remove("flex");
                      }}
                    >
                      {sensor}
                    </p>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setSensorName("");
                }}
              >
                x
              </Button>
            </div>
          </FormControl>
          <FormMessage/>
        </FormItem>
        <div className="h-auto flex flex-wrap flex-start gap-2">
          {selectedSensors.map((sensor, index) => (
            <div id={`sensor${index}`} key={sensor} className="flex items-center space-x-2 border-2 rounded border-black border-solid px-2 py-1 bg-gray-600">
              <span>
                {sensor}
              </span>
              <button
                className="bg-gray-900 w-5 h-5 rounded text-white flex items-center justify-center"
                type="button"
                onClick={() => {
                  setSelectedSensors((prev) => prev.filter((_, i) => i !== index))
                  document.querySelector(`sensor${index}`)?.remove();
                  form.setValue("sensors", selectedSensors)
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="disabled:cursor-not-allowed"
            >
              {form.formState.isSubmitting ? (
                <>
                  Please Wait
                </>
              ): (
                "Add"
              )}
            </Button>
            <AlertDialogAction
              className="hidden"
              ref={alertDialogAction}
            ></AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </Form>
  )
}

export default AddDeviceForm;