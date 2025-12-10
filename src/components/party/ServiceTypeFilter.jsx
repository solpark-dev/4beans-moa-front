import { useEffect } from "react";
import { usePartyStore } from "../../store/party/partyStore";

export default function ServiceTypeFilter({ selectedProductId, onSelect }) {
    const products = usePartyStore((state) => state.products);
    const loadProducts = usePartyStore((state) => state.loadProducts);

    useEffect(() => {
        if (!products.length) {
            loadProducts();
        }
    }, [products, loadProducts]);

    return (
        <div className="relative">
            <select
                value={selectedProductId || ""}
                onChange={(e) => onSelect(e.target.value ? Number(e.target.value) : null)}
                className="appearance-none bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer min-w-[140px]"
            >
                <option value="">OTT 전체</option>
                {products.map((product) => (
                    <option key={product.productId} value={product.productId}>
                        {product.productName}
                    </option>
                ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
}
