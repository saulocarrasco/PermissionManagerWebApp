'use client'
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
  Card,
} from "@material-tailwind/react";
import { useRef } from "react";
import { PermissionModal } from "./permission-modal";
import { PermissionType } from "@/enums/permission-type.enum";

const MAX_TABLE_PAGES = 10;
const TABLE_HEAD = ["Member", "Permission Date", "Permission Type", ""];

export default function PermissionsTable({ permissionList: { permissions, count }, pagination, setPagination }) {
  const modalRef = useRef(0);
  const pageNumber = Math.ceil(count / pagination.pageSize);

  const getPagesToGenerate = () => {
    var result = [];
    if (pageNumber <= MAX_TABLE_PAGES) {
      result = [...Array(pageNumber + 1).keys()];
      result.shift();
      return result;
    }

    const halfMaxPages = Math.round(MAX_TABLE_PAGES / 2);

    var pageToIndex = pageNumber - pagination.currentPage > halfMaxPages ?
      pagination.currentPage - halfMaxPages :
      pagination.currentPage - ((MAX_TABLE_PAGES - 1) - (pageNumber - pagination.currentPage));

    while (result.length < MAX_TABLE_PAGES) {
      if (pageToIndex < 1) {
        pageToIndex++;
        continue;
      }
      if (pageToIndex == pageNumber) {
        break;
      }
      result.push(pageToIndex)
      pageToIndex++;
    }

    result[0] = 1;
    result[MAX_TABLE_PAGES - 1] = pageNumber;

    return result;
  }

  const handleCreateModal = () => {
    modalRef.current.toggle();
  };

  const handleEditModal = (model) => {
    modalRef.current.toggle(model);
  };

  const handlePageChanged = (page) => {
    setPagination({ ...pagination, currentPage: page })
  };

  const handlePermissionUpdated = (created) => {
    if (created) {
      setPagination({ ...pagination, currentPage: 1 });
      return;
    }

    setPagination({ ...pagination });
  }

  return (
    <>
      <Card className="h-full w-full flex flex-col min-h-[100vh]">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Permission Manager
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about the last permissions
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button className="flex items-center gap-3" size="sm" onClick={handleCreateModal}>
                <CalendarDaysIcon strokeWidth={2} className="h-4 w-4" /> Add Permission
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map(
                (
                  permission,
                  index,
                ) => {
                  const {
                    id,
                    employeeForename,
                    employeeSurname,
                    permissionDate,
                    permissionTypeId
                  } = permission;
                  const isLast = index === permissions.length - 1;
                  const classes = isLast
                    ? "p-4 border-b"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold"
                          >
                            {employeeForename + " " + employeeSurname}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(permissionDate).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {Object.keys(PermissionType).find(key => PermissionType[key] === permissionTypeId)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit Permission">
                          <IconButton variant="text" onClick={() => { handleEditModal(permission) }}>
                            <PencilIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex mt-auto items-center justify-between border-t border-blue-gray-50 p-4">
          <Button disabled={pagination.currentPage === 1} onClick={() => handlePageChanged(pagination.currentPage - 1)} variant="outlined" size="sm">
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {getPagesToGenerate().map((page) => (
              <IconButton onClick={() => handlePageChanged(page)} key={page} variant={pagination.currentPage == page ? "outlined" : "text"} size="sm">
                {page}
              </IconButton>
            ))}
          </div>
          <Button disabled={pagination.currentPage === pageNumber} onClick={() => handlePageChanged(pagination.currentPage + 1)} variant="outlined" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>

      <PermissionModal onPermissionUpdated={handlePermissionUpdated} ref={modalRef} />
    </>
  );
}