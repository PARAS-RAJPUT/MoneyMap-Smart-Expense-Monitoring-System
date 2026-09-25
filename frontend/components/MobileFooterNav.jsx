"use client";

export default function MobileFooterNav({ onNewExpense }) {
  return (
    <footer className="lg:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-50">
      <button className="flex flex-col items-center gap-1 text-emerald-600">
        <iconify-icon icon="lucide:layout-grid" class="text-2xl"></iconify-icon>
        <span className="text-[10px] font-bold">Home</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <iconify-icon icon="lucide:wallet" class="text-2xl"></iconify-icon>
        <span className="text-[10px] font-bold">Wallet</span>
      </button>

      <button
        onClick={onNewExpense}
        className="-mt-8 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"
      >
        <iconify-icon icon="lucide:plus" class="text-3xl"></iconify-icon>
      </button>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <iconify-icon icon="lucide:bar-chart-3" class="text-2xl"></iconify-icon>
        <span className="text-[10px] font-bold">Stats</span>
      </button>

      <button className="flex flex-col items-center gap-1 text-slate-400">
        <iconify-icon icon="lucide:user" class="text-2xl"></iconify-icon>
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </footer>
  );
}
