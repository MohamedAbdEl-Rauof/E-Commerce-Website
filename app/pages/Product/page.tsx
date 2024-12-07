"use client";
import React, {useState, useMemo, useEffect} from 'react';
import {Heart, Info, Search, Grid, LayoutGrid, PauseCircle, Equal, X} from 'lucide-react';
import {motion, AnimatePresence} from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from "@/app/components/Header/page";
import Footer from "@/app/components/Footer/page";
import {useRouter} from "next/navigation";

// Types
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    priceBeforeDiscount?: number;
    isNew?: boolean;
    discount?: number;
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PriceRange {
    label: string;
    range: string;
    min: number;
    max: number | null;
}

interface ProductDetails {
    isOpen: boolean;
    productId: string | null;
}

type ViewOption = 'grid' | 'large' | 'split' | 'list';

// Constants
const PRICE_RANGES: PriceRange[] = [
    {label: "All Price", range: "all", min: 0, max: null},
    {label: "$0.00 - $99.99", range: "0-99.99", min: 0, max: 99.99},
    {label: "$100.00 - $199.99", range: "100-199.99", min: 100, max: 199.99},
    {label: "$200.00 - $299.99", range: "200-299.99", min: 200, max: 299.99},
    {label: "$300.00 - $399.99", range: "300-399.99", min: 300, max: 399.99},
    {label: "$400.00+", range: "400", min: 400, max: null},
];

const VIEW_OPTIONS = [
    {icon: Grid, label: "Grid View", value: "grid"},
    {icon: LayoutGrid, label: "Large Grid View", value: "large"},
    {icon: PauseCircle, label: "Split View", value: "split"},
    {icon: Equal, label: "List View", value: "list"}
] as const;

const PRODUCTS_PER_PAGE = 9;

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Header/>
            <div className="w-[90%] mx-auto mt-14">
                <Skeleton height={400} className="mb-8 rounded-xl"/>
                <div className="max-w-xl mx-auto mb-8">
                    <Skeleton height={48} className="rounded-full"/>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <Skeleton height={400} className="rounded-lg"/>
                    </div>
                    <div className="lg:col-span-3">
                        <Skeleton height={56} className="rounded-lg mb-6"/>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton height={200} className="rounded-lg"/>
                                    <Skeleton count={2} className="rounded"/>
                                    <Skeleton height={36} className="rounded-lg"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <Footer/>
            </div>
        </div>
    );
};

// Product Card Component
const ProductCard: React.FC<{
    product: Product;
    isList: boolean;
    onFavorite: (id: string) => void;
    isFavorite: boolean;
    onShowDetails: (id: string) => void;
}> = ({product, isList, onFavorite, isFavorite, onShowDetails}) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            className={`bg-white rounded-lg shadow-sm overflow-hidden group ${
                isList ? 'flex gap-6' : ''
            }`}
        >
            <div className={`relative ${isList ? 'w-1/3' : 'w-full'}`}>
                <div className="aspect-w-1 aspect-h-1 overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
                <motion.div className="absolute top-4 right-4 space-x-2">
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => onFavorite(product.id)}
                        className="p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <Heart className={isFavorite ? "text-red-500 fill-current" : ""}/>
                    </motion.button>
                    <motion.button
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                        onClick={() => onShowDetails(product.id)}
                        className="p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                        <Info/>
                    </motion.button>
                </motion.div>
                {product.isNew && (
                    <span
                        className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
            New
          </span>
                )}
                {product.discount && (
                    <span
                        className="absolute top-14 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            -{product.discount}%
          </span>
                )}
            </div>
            <div className="p-4 flex-1">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    {product.priceBeforeDiscount && (
                        <span className="text-gray-400 line-through">
              ${product.priceBeforeDiscount}
            </span>
                    )}
                </div>
                <motion.button
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    className="mt-4 w-full bg-black text-white py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    Add to Cart
                </motion.button>
            </div>
        </motion.div>
    );
};

// Product Details Modal Component
const ProductDetailsModal: React.FC<{
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({product, isOpen, onClose}) => {
    if (!product || !isOpen) return null;

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{scale: 0.95, opacity: 0}}
                animate={{scale: 1, opacity: 1}}
                exit={{scale: 0.95, opacity: 0}}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                    <img src={product.image} alt={product.name} className="w-full h-64 object-cover"/>
                </div>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Product Details</h3>
                            <p className="text-gray-600 mb-4">{product.description}</p>
                            <div className="space-y-2">
                                <p><span className="font-medium">Category:</span> {product.category}</p>
                                <p>
                                    <span className="font-medium">Created:</span>{' '}
                                    {new Date(product.createdAt || '').toLocaleDateString()}
                                </p>
                                <p>
                                    <span className="font-medium">Last Updated:</span>{' '}
                                    {new Date(product.updatedAt || '').toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                                    {product.priceBeforeDiscount && (
                                        <span className="text-gray-400 line-through text-lg">
                      ${product.priceBeforeDiscount}
                    </span>
                                    )}
                                </div>
                                {product.discount && (
                                    <div className="mb-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                      Save {product.discount}%
                    </span>
                                    </div>
                                )}
                                <button
                                    className="w-full bg-black text-white py-3 rounded-lg hover:bg-black/90 transition-colors">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Main App Component
function App() {
    const [filters, setFilters] = useState({
        priceRange: 'all',
        view: 'grid' as ViewOption,
        search: '',
    });
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [productDetails, setProductDetails] = useState<ProductDetails>({
        isOpen: false,
        productId: null,
    });
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(PRODUCTS_PER_PAGE);
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter((product) =>
                product.name.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.priceRange !== 'all') {
            const range = PRICE_RANGES.find((r) => r.range === filters.priceRange);
            if (range) {
                result = result.filter((product) => {
                    if (range.max === null) return product.price >= range.min;
                    return product.price >= range.min && product.price <= range.max;
                });
            }
        }

        return result;
    }, [filters, products]);

    const toggleFavorite = (productId: string) => {
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(productId)) {
                next.delete(productId);
            } else {
                next.add(productId);
            }
            return next;
        });
    };

    const loadMore = () => {
        setVisibleProducts((prev) => prev + PRODUCTS_PER_PAGE);
    };

    const getGridClasses = () => {
        switch (filters.view) {
            case 'large':
                return 'grid-cols-1 lg:grid-cols-2 gap-8';
            case 'split':
                return 'grid-cols-1 lg:grid-cols-2 gap-6';
            case 'list':
                return 'grid-cols-1 gap-4';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6';
        }
    };

    const hasMore = visibleProducts < filteredProducts.length;

    const selectedProduct = productDetails.productId
        ? products.find(p => p.id === productDetails.productId)
        : null;

    if (isLoading) {
        return <LoadingSkeleton/>;
    }

    return (
        <div className="min-h-screen">
            <Header/>
            <div className="w-[90%] mx-auto pt-24">
                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                            className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="sticky top-4 bg-white p-6 rounded-lg shadow-sm">
                            <div className="mb-8">
                                <h3 className="font-semibold mb-4">Price Range</h3>
                                <div className="space-y-2">
                                    {PRICE_RANGES.map((range) => (
                                        <label
                                            key={range.range}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                                        >
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={filters.priceRange === range.range}
                                                onChange={() => setFilters({...filters, priceRange: range.range})}
                                                className="form-radio text-black"
                                            />
                                            <span>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:w-3/4">
                        {/* View Controls */}
                        <div
                            className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                {VIEW_OPTIONS.map(({icon: Icon, label, value}) => (
                                    <motion.button
                                        key={value}
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.9}}
                                        onClick={() => setFilters({...filters, view: value})}
                                        className={`p-2 rounded transition ${
                                            filters.view === value
                                                ? 'bg-black text-white'
                                                : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                        title={label}
                                    >
                                        <Icon/>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Products */}
                        {filteredProducts.length > 0 ? (
                            <div className="space-y-8">
                                <div className={`grid ${getGridClasses()}`}>
                                    <AnimatePresence>
                                        {filteredProducts.slice(0, visibleProducts).map((product) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                isList={filters.view === 'list'}
                                                onFavorite={toggleFavorite}
                                                isFavorite={favorites.has(product.id)}
                                                onShowDetails={(id) => {
                                                    setProductDetails({isOpen: true, productId: id});
                                                    router.push("/pages/ProductDetails");
                                                }}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {hasMore && (
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        className="flex justify-center"
                                    >
                                        <motion.button
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                            onClick={loadMore}
                                            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-black/90 transition-colors"
                                        >
                                            Show More
                                        </motion.button>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                className="text-center py-12 bg-white rounded-lg"
                            >
                                <p className="text-gray-500">No products found matching your criteria</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Details Modal */}
            <AnimatePresence>
                {productDetails.isOpen && (
                    <ProductDetailsModal
                        product={selectedProduct}
                        isOpen={productDetails.isOpen}
                        onClose={() => setProductDetails({isOpen: false, productId: null})}
                    />
                )}
            </AnimatePresence>
            <div className="mt-16">
                <Footer/>
            </div>
        </div>
    );
}

export default App;