// src/contexts/index.tsx
import React, { createContext, useContext } from 'react';

/** ModalSize */
type ModalCtx = { modalSize: 'compact' | 'default' | string };
const ModalSizeContext = createContext<ModalCtx | undefined>(undefined);
export function ModalSizeProvider({
  modalSize = 'default',
  children,
}: { modalSize?: ModalCtx['modalSize']; children: React.ReactNode }) {
  return <ModalSizeContext.Provider value={{ modalSize }}>{children}</ModalSizeContext.Provider>;
}
export const useModalSize = () => {
  const ctx = useContext(ModalSizeContext);
  if (!ctx) throw new Error('useModalSize must be used within ModalSizeProvider');
  return ctx;
}

/** TransactionStore (stub) */
const TxStoreContext = createContext<Record<string, unknown>>({});
export function TransactionStoreProvider({ children }: { children: React.ReactNode }) {
  return <TxStoreContext.Provider value={{}}>{children}</TxStoreContext.Provider>;
}
export const useTransactionStore = () => useContext(TxStoreContext);

/** ShowBalance (stub) */
const ShowBalanceContext = createContext<{ show?: boolean }>({ show: true });
export function ShowBalanceProvider({ children }: { children: React.ReactNode }) {
  return <ShowBalanceContext.Provider value={{ show: true }}>{children}</ShowBalanceContext.Provider>;
}
export const useShowBalance = () => useContext(ShowBalanceContext);

/** ModalProvider (stub) */
const ModalContext = createContext<Record<string, unknown>>({});
export function ModalProvider({ children }: { children: React.ReactNode }) {
  return <ModalContext.Provider value={{}}>{children}</ModalContext.Provider>;
}
export const useModal = () => useContext(ModalContext);