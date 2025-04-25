import {
  Button,
  Checkbox,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { Members, Users } from "../type";
import { getAllUsers } from "../Api";
import SearchBox from "./SearchBox";
import { CheckIcon } from "lucide-react";

interface props {
  isOpen: boolean;
  projectMember: Members[] | undefined;
  toggleMemberDialog: () => void;
}

function MemberDialog({ isOpen, projectMember, toggleMemberDialog }: props) {
  const [users, setUsers] = useState<Users[]>([]);

  function closeDialog() {
    toggleMemberDialog();
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const Users = await getAllUsers();
      setUsers(Users);
    };
    fetchUsers();
  }, []);

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-30 focus:outline-none"
      onClose={closeDialog}
    >
      <div className="fixed inset-0 z-30 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full space-y-3 max-w-xl border-1 rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="absolute flex right-5 cursor-pointer">
              <div onClick={closeDialog}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <DialogTitle as="h3" className="text-base/7 font-medium text-black">
              Add User
            </DialogTitle>
            <SearchBox placeholder="Search Users" />
            <p className="text-center text-sm/6 text-black/50">
              not select user yet.
            </p>
            {users
              .filter(
                (user) =>
                  !projectMember ||
                  projectMember.every((member) => member._id !== user._id)
              )
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        className="object-cover"
                        src="/default_user_logo.png"
                        alt="user_picture"
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs">{user.name}</div>
                    </div>
                  </div>

                  <Checkbox
                    checked={false}
                    onChange={() => ({})}
                    className="group size-6 rounded-md  p-1 ring-1 ring-black ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
                  >
                    <CheckIcon className="hidden size-4 fill-black group-data-checked:block" />
                  </Checkbox>
                </div>
              ))}
            <div>
              <Button
                className="inline-flex items-center w-full justify-center gap-2 rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-blue-700 data-open:bg-gray-700"
                onClick={closeDialog}
              >
                Add Users
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export default MemberDialog;
