"use client"

import PermissionsTable from "@/components/permissions-table";
import { PermissionsService } from "@/services/permissions.service";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const DEFAULT_PAGE_SIZE = 5;
  const permissionsService = new PermissionsService();

  const [permissionList, setPermissionList] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  })

  useEffect(() => {
    const getPermissions = async () => {
      const response = await permissionsService.list(pagination.currentPage, pagination.pageSize);
      if (!response) return;
      setPermissionList(response);
    }
    getPermissions();
  }, [pagination]);


  return (
    <div>
      {!!permissionList && (<PermissionsTable permissionList={permissionList} pagination={pagination} setPagination={setPagination} />)}
    </div>
  );
}