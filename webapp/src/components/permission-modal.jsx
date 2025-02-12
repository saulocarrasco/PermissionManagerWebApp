import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PermissionType } from "@/enums/permission-type.enum";
import { PermissionsService } from "@/services/permissions.service";
import { toast, ToastContainer } from "react-toastify";

export const PermissionModal = forwardRef(({ onPermissionUpdated }, ref) => {
  const permissionsService = new PermissionsService();

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("Add");
  const [model, setModel] = useState({ employeeForename: '', employeeSurname: '', permissionTypeId: 0 });

  const toggle = (permission) => {
    if (open) {
      setModel({ employeeForename: '', employeeSurname: '', permissionTypeId: 0 });
    }

    if (permission) {
      setModel(permission);
      setAction("Edit");
    } else {
      setAction("Add");
    }

    setOpen(!open);
  }

  useImperativeHandle(ref, () => ({
    toggle: (permission) => {
      toggle(permission);
    }
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModel((model) => ({
      ...model,
      [name]: value
    }));
  };

  const handlePermissionTypeChange = (e) => {
    model.permissionTypeId = e;
    setModel(model);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!model.id)
      permissionsService.create(model)
        .then(() => {
          toggle();
          onPermissionUpdated(true);
        }).catch((e) => {
          toast.error("There was an error while adding the permission.");
          console.log(e);
        });
    else
      permissionsService.update(model)
        .then(() => {
          toggle();
          onPermissionUpdated();
        }).catch((e) => {
          toast.error("There was an error while editing the permission.");
          console.log(e);
        });
  };

  return (
    <Dialog size="sm" open={open} handler={toggle} className="p-4">
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          {action} Permission
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={toggle}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="space-y-4 pb-6">
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 text-left font-medium"
          >
            Name
          </Typography>
          <Input
            color="gray"
            size="lg"
            name="employeeForename"
            value={model.employeeForename}
            onChange={handleChange}
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 text-left font-medium"
          >
            Last Name
          </Typography>
          <Input
            color="gray"
            size="lg"
            name="employeeSurname"
            value={model.employeeSurname}
            onChange={handleChange}
            className="placeholder:opacity-100 focus:!border-t-gray-900"
            containerProps={{
              className: "!min-w-full",
            }}
            labelProps={{
              className: "hidden",
            }}
          />
        </div>
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 text-left font-medium"
          >
            Permission Type
          </Typography>
          <Select
            name="permissionType"
            onChange={handlePermissionTypeChange}
            value={model.permissionTypeId}
            className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
            placeholder="1"
            labelProps={{
              className: "hidden",
            }}
          >
            {Object.keys(PermissionType).map((permissionType) => (
              <Option value={PermissionType[permissionType]} key={permissionType}>{permissionType}</Option>
            ))}
          </Select>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="ml-auto" onClick={handleSubmit}>
          {action} Permission
        </Button>
      </DialogFooter>
      <ToastContainer />
    </Dialog>
  );
})