"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Header() {
  const router = useRouter();
  return (
    <div className="mx-auto border-b-[15px] border-[#95BFDD] px-6 ">
      <div className="mx-auto mb-6 mt-8 flex max-w-7xl justify-between">
        <Link href="https://hivpolicylab.org/">
          <Image
            src="/logo.svg"
            alt="hiv_policy_lab"
            width="210"
            height="30"
            className="cursor-pointer"
          />
        </Link>
        <div className="flex items-center gap-x-3">
          {/* Contact Us */}
          <a
            href="https://www.hivpolicylab.org/contact/"
            className="flex items-center justify-center gap-1 rounded  bg-zinc-100 px-4 py-3 "
          >
            <Image src="/mail.svg" alt="mail_icon" width={16} height={16} />
            <div className="text-xs font-medium text-blue-900 ">Contact Us</div>
          </a>

          <a href="https://twitter.com/hivpolicylab">
            <Image
              className="cursor-pointer "
              alt="twitter_logo"
              src={"/X.svg"}
              width={20}
              height={20}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Header;
