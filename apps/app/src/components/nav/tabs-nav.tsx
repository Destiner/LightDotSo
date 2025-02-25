// Copyright 2023-2024 Light, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Full complete example from: https://github.com/hqasmei/youtube-tutorials/blob/ee44df8fbf6ab4f4c2f7675f17d67813947a7f61/vercel-animated-tabs/src/components/tabs.tsx
// License: MIT

import { useBaseSlug, useMediaQuery } from "@lightdotso/hooks";
import type { Tab } from "@lightdotso/types";
import { Badge } from "@lightdotso/ui";
import { cn } from "@lightdotso/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { usePathType } from "@/hooks";

// -----------------------------------------------------------------------------
// Const
// -----------------------------------------------------------------------------

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

type TabNavProps = {
  setSelectedTabIndex: (_index: number) => void;
  selectedTabIndex: number | undefined;
  tabs: Tab[];
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export const TabsNav: FC<TabNavProps> = ({
  tabs,
  selectedTabIndex,
  setSelectedTabIndex,
}) => {
  // ---------------------------------------------------------------------------
  // State Hooks
  // ---------------------------------------------------------------------------

  const [anchorRefs, setAnchorRefs] = useState<Array<HTMLAnchorElement | null>>(
    [],
  );
  const [isAnimated, setIsAnimated] = useState(false);

  // ---------------------------------------------------------------------------
  // Ref Hooks
  // ---------------------------------------------------------------------------

  const navRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Hooks
  // ---------------------------------------------------------------------------

  const baseSlug = useBaseSlug();
  const isDesktop = useMediaQuery("md");

  // ---------------------------------------------------------------------------
  // Operation Hooks
  // ---------------------------------------------------------------------------

  const pathType = usePathType();

  // ---------------------------------------------------------------------------
  // State Hooks
  // ---------------------------------------------------------------------------

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // Local Variables
  // ---------------------------------------------------------------------------

  const navRect = navRef.current?.getBoundingClientRect();

  const selectedRect =
    selectedTabIndex !== undefined
      ? anchorRefs[selectedTabIndex]?.getBoundingClientRect()
      : undefined;

  const hoveredRect =
    anchorRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  // ---------------------------------------------------------------------------
  // Effect Hooks
  // ---------------------------------------------------------------------------

  // Set the anchor refs array length to the tabs length
  useEffect(() => {
    setAnchorRefs(prev => prev.slice(0, tabs.length));
  }, [tabs.length]);

  // Animate the indicator on first render
  useEffect(() => {
    if (
      selectedTabIndex !== undefined &&
      !isAnimated &&
      selectedRect &&
      navRect
    ) {
      setIsAnimated(true);
    }
  }, [selectedRect, navRect, selectedTabIndex, isAnimated]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (pathType === "unauthenticated" || pathType === "authenticated") {
    return null;
  }

  return (
    <nav
      ref={navRef}
      className="relative z-0 mb-1.5 mt-2 flex max-w-full shrink-0 items-center overflow-x-auto overflow-y-visible py-2"
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      onPointerLeave={e => setHoveredTabIndex(null)}
    >
      {tabs.map((item, i) => {
        const isActive =
          hoveredTabIndex === i || selectedTabIndex === i || false;

        return (
          <Link
            key={i}
            passHref
            legacyBehavior
            href={`${baseSlug}${item.href}`}
          >
            <motion.a
              // @ts-ignore
              ref={el => (anchorRefs[i] = el)}
              className={cn(
                "relative z-20 mb-0.5 flex h-10 cursor-pointer select-none items-center rounded-md bg-transparent px-2.5 text-sm font-medium transition-colors hover:text-text-weak",
                !isActive ? "text-text-weak" : "text-text hover:text-text",
              )}
              onPointerEnter={() => {
                setHoveredTabIndex(i);
              }}
              onFocus={() => {
                setHoveredTabIndex(i);
              }}
              onClick={() => {
                setSelectedTabIndex(i);
              }}
            >
              {<item.icon className="mr-2 size-4" />}
              {item.label}
              {item?.number && item?.number !== 0 && (
                <Badge
                  type="number"
                  variant="outline"
                  className="font-sm ml-2 rounded-full border-0 bg-background-strong text-text-weak"
                >
                  {item?.number}
                </Badge>
              )}
            </motion.a>
          </Link>
        );
      })}
      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            key={"hover"}
            className="absolute left-0 top-0 z-10 mb-1 rounded-md bg-background-stronger"
            initial={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 0,
            }}
            animate={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 1,
            }}
            exit={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 0,
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>
      {selectedRect && navRect && isAnimated && isDesktop && (
        <motion.div
          className={
            "absolute bottom-0 left-0.5 z-10 h-[3px] rounded-lg bg-background-primary"
          }
          initial={false}
          animate={{
            width: selectedRect.width * 0.8,
            x: `calc(${selectedRect.left - navRect.left}px + 10%)`,
            opacity: 1,
          }}
          transition={transition}
        />
      )}
      {/* {selectedRect && navRect && !isDesktop && (
        <div
          className="absolute left-0 bottom-0 z-10 h-[2px] bg-background-primary"
          style={{
            width: selectedRect.width,
            // transform: `translateX(${selectedRect.left - navRect?.left}px)`,
          }}
        />
      )} */}
    </nav>
  );
};
