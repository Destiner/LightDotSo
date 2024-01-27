// Copyright (C) 2023 Light, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

"use client";

import { useSignInWithSiwe } from "@lightdotso/hooks";
import { Button } from "@lightdotso/ui";
import { baseHeightWrapper } from "@lightdotso/ui/src/wrappers/base";
import { cn } from "@lightdotso/utils";
import { UserIcon } from "lucide-react";
import type { FC } from "react";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const Login: FC = () => {
  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------

  const { isPending, handleSignIn } = useSignInWithSiwe();

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={cn("text-center", baseHeightWrapper)}>
      <UserIcon className="mx-auto size-8 rounded-full border border-border p-2 text-text md:size-10" />
      <h3 className="mt-2 text-xl font-semibold tracking-tight md:mt-4 md:text-2xl">
        Login
      </h3>
      <p className="mt-1 text-sm text-text-weak md:text-base">
        Get started first by logging in.
      </p>
      <div className="mt-6 flex justify-center">
        <Button
          className="w-full md:w-32"
          isLoading={isPending}
          disabled={isPending}
          onClick={handleSignIn}
        >
          Login
        </Button>
      </div>
    </div>
  );
};
