"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { AiOutlineDisconnect } from "react-icons/ai";
import { useNetwork, useSwitchNetwork } from "wagmi"; // Import the useNetwork hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/dialog";
import Image from "next/image";
import { HiExclamationCircle } from "react-icons/hi";

type ProfileProps = {
  size?: string;
};

export default function Profile({ size = "md" }: ProfileProps) {
  const { address, connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const buttonWidth = size === "md" ? `w-[200px]` : `w-[150px]`;
  const buttonPadding = size === "md" ? `p-2` : `p-1`;

  return (
    <div suppressHydrationWarning={true}>
      {isConnected ? (
        <>
          {chain && chain.id !== 20 ? (
            <div className="flex flex-row items-center justify-center gap-2">
              <button
                className={`flex ${buttonWidth} flex-row flex-nowrap items-center justify-center gap-2 rounded-md bg-pink-600 ${buttonPadding} text-xs font-bold text-white hover:bg-pink-700`}
                onClick={() => switchNetwork?.(20)}
              >
                <HiExclamationCircle size={24} />
                <div className="text-white">Switch to ESC</div>
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-2">
              <button
                className={`flex ${buttonWidth} flex-row items-center justify-center gap-2 rounded-md bg-sky-400 ${buttonPadding} font-bold text-white hover:bg-sky-500`}
                onClick={() => disconnect()}
              >
                <div className="text-white">{address?.slice(0, 8)}</div>
                <AiOutlineDisconnect size={24} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-row items-center justify-center gap-2">
          <Dialog>
            <DialogTrigger
              className={`flex ${buttonWidth} items-center justify-center rounded-md bg-sky-400 ${buttonPadding} font-bold text-white hover:bg-sky-500`}
            >
              Connect Wallet
            </DialogTrigger>
            <DialogContent className="mx-4 w-5/6 border-none bg-indigo-800/60">
              <DialogHeader>
                <DialogTitle className="font-semibold text-white">
                  Choose Wallet
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 text-white md:flex-row">
                {connectors.map((connector) => (
                  <button
                    className={`flex flex-row items-center justify-center gap-2 rounded-md bg-indigo-900 ${buttonPadding} text-sm font-extrabold`}
                    disabled={!connector.ready}
                    key={connector.id}
                    onClick={() => connect({ connector })}
                  >
                    <Image
                      src={
                        connector.id === "injected"
                          ? `/icons/metamask.svg`
                          : `/icons/walletConnect.svg`
                      }
                      width={26}
                      height={26}
                      alt={
                        connector.id === "injected"
                          ? `MetaMask`
                          : `Wallet Connect`
                      }
                    />
                    {connector.name}
                    {/* {isLoading &&
                pendingConnector?.id === connector.id &&
                " (connecting)"} */}
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
