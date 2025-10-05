"use client";
import React, { MouseEventHandler, useRef } from "react";

type Props = {
  policies: Array<Policy>;
  selectedPolicyId: number;
  setSelectedPolicyId: React.Dispatch<React.SetStateAction<number>>;
};

function PolicyScroller({
  policies,
  selectedPolicyId,
  setSelectedPolicyId,
}: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>();

  const handleScrollToRight = () => {
    scrollContainerRef.current.scrollLeft += 308;
  };
  const handleScrollToLeft = () => {
    scrollContainerRef.current.scrollLeft -= 308;
  };

  return (
    <div className="my-2 flex flex-row space-x-2">
      <div>
        <button
          onClick={handleScrollToLeft}
          className=" h-full w-8 bg-zinc-100 text-center align-middle "
        >
          {"<"}
        </button>
      </div>
      <div
        ref={scrollContainerRef}
        className=" overflow-x-scroll scroll-smooth scrollbar-hide  "
      >
        <div className=" flex  space-x-4">
          {policies.map((policy, idx) => (
            <div
              title={policy.name}
              className={`relative cursor-pointer border-2 bg-zinc-100  py-5`}
              key={policy.id}
              onClick={() => {
                setSelectedPolicyId(policy.id);
              }}
            >
              {policy.id === selectedPolicyId && (
                <div className="absolute bottom-0 h-2 w-full bg-primary-light" />
              )}
              <p className="line-clamp-3 w-72 px-4 font-sans font-medium text-grey">
                {policy.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button
          onClick={handleScrollToRight}
          className=" right-0 h-full w-8 bg-zinc-100 text-center align-middle"
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

export default PolicyScroller;
