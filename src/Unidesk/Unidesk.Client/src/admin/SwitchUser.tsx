import { httpClient } from "@core/init";
import { useContext, useState } from "react";

import { useOpenClose } from "hooks/useOpenClose";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { Modal } from "ui/Modal";
import { TextField } from "ui/TextField";
import { UserContext } from "user/UserContext";

export const SwitchUser = () => {
  const { open, close, isOpen } = useOpenClose(false);
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    open();
  };

  const switchUser = async () => {
    const newUser = await httpClient.admin.switchUser({ username });
    setUser(newUser);
  };

  return (
    <>
      <Button text justify="justify-start" error onClick={handleClick}>
        Switch user
      </Button>
      {isOpen && (
        <Modal open={isOpen} onClose={close} y="center" height="sm" className="flex items-start bg-slate-100 p-6">
          <FormField as={TextField} classNameField="grow" value={username} onValue={setUsername} label="Username" />
          <Button text onClick={switchUser} disabled={username.length < 3}>
            Switch
          </Button>
        </Modal>
      )}
    </>
  );
};
