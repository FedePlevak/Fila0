import React, { useContext, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Plus, Minus, Star, Clock, Info, X, ChevronRight, Trash2, Ticket } from 'lucide-react';
import { AppContext } from '../../App';
import { useVendor } from '../../hooks/useVendors';
import { useMenu } from '../../hooks/useMenu';

export default function VendorMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState('Hamburguesas');

  const { vendor, loading: loadingVendor, error: errorVendor } = useVendor(id);
  const { items, loading: loadingMenu, error: errorMenu } = useMenu(id);

  React.useEffect(() => {
    if (items.length > 0 && !items.find(i => i.category === activeCategory)) {
      setActiveCategory(items[0].category || 'General');
    }
  }, [items]);

  if (loadingVendor || loadingMenu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (errorVendor || errorMenu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 gap-4">
        <p className="text-red-500 font-bold">Error: {errorVendor || errorMenu}</p>
        <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-xl">Volver al inicio</button>
      </div>
    );
  }

  if (!vendor) return <div>Vendor not found</div>;

  const cartTotal = context?.cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0) || 0;
  const cartCount = context?.cart.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <nav className="sticky top-0 z-50 bg-white dark:bg-[#1F2933] border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">Fila</span>
              <div className="bg-primary text-secondary rounded-lg p-1.5 transform -rotate-12 shadow-sm shrink-0">
                <Ticket size={24} fill="currentColor" className="text-secondary" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-100 dark:border-gray-700">
            <span className="text-sm font-medium text-slate-600 dark:text-gray-300">Retirá en: <span className="font-bold text-primary dark:text-white">Puesto A - {vendor.name}</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary dark:text-white hover:opacity-80 transition-opacity">
              <span>Mi Pedido</span>
              <div className="relative">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-secondary text-charcoal text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">{cartCount}</span>}
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              <h3 className="text-lg font-bold text-primary dark:text-gray-300 mb-6 px-2 tracking-tight">Categorías</h3>
              {Array.from(new Set(items.map(i => i.category || 'General'))).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm ${activeCategory === cat ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-slate-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <span>{cat}</span>
                  <ChevronRight size={16} className={activeCategory === cat ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </aside>

          {/* Menu Column */}
          <div className="lg:col-span-6 space-y-10">
            {/* Vendor Hero Card */}
            <div className="rounded-[2.5rem] overflow-hidden bg-white dark:bg-gray-800 shadow-soft border border-gray-100 dark:border-gray-700 relative group">
              <div className="h-32 sm:h-48 bg-cover bg-center bg-slate-200 dark:bg-slate-700" style={{ backgroundImage: `url('${vendor.image}')` }}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all"></div>
              </div>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
                <div className="absolute -top-10 sm:-top-12 left-6 sm:left-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white">
                    <img
                      src={vendor.image}
                      alt="Logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                </div>
                <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="w-full pl-24 sm:pl-32">
                    <h1 className="text-3xl sm:text-5xl font-black text-charcoal dark:text-white tracking-tight leading-tight">{vendor.name}</h1>
                    <p className="text-slate-500 dark:text-gray-400 text-sm sm:text-lg mt-2 font-medium max-w-2xl leading-relaxed">{vendor.description}</p>
                    <div className="flex items-center gap-6 mt-6 text-xs sm:text-sm font-bold text-slate-500">
                      <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                        <Clock size={16} className="text-primary" /> {vendor.waitTime}
                      </span>
                      <span className="flex items-center gap-2 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900/30">
                        <Star size={16} className="fill-yellow-500" /> {vendor.rating} (120+)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Sections */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black text-charcoal dark:text-gray-200 tracking-tight">{activeCategory}</h2>
                <div className="h-px flex-grow bg-gray-100 dark:bg-gray-700"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {items.filter(item => item.category === activeCategory).length > 0 ? (
                  items.filter(item => item.category === activeCategory).map(item => {
                    // Buscar si el producto ya está en el carrito (sumando cantidades si hay múltiples entradas del mismo producto)
                    // Para simplificar la vista de menú, sumamos todas las variantes del mismo producto
                    const cartItemsForProduct = context?.cart.filter(i => i.product.id === item.id) || [];
                    const totalQuantity = cartItemsForProduct.reduce((acc, curr) => acc + curr.quantity, 0);
                    const inCart = totalQuantity > 0;

                    const handleAdd = () => {
                      context?.addToCart({
                        product: item,
                        quantity: 1,
                        removed_ingredients: [],
                        selected_modifiers: {},
                        uuid: self.crypto.randomUUID()
                      });
                    };

                    const handleRemove = () => {
                      // Estrategia simple: remover la última instancia agregada de este producto
                      const lastInstance = cartItemsForProduct[cartItemsForProduct.length - 1];
                      if (lastInstance) {
                        context?.removeFromCart(lastInstance.uuid);
                      }
                    };

                    return (
                      <article key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-50 dark:border-gray-700 flex gap-4 sm:gap-6 hover:shadow-md transition-all group">
                        <div className="flex-grow flex flex-col justify-between overflow-hidden">
                          <div className="space-y-1 sm:space-y-2">
                            <h3 className="text-base sm:text-lg font-bold text-charcoal dark:text-white leading-tight truncate">{item.name}</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs leading-relaxed line-clamp-2">{item.description}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4 sm:mt-6 gap-2">
                            <span className="font-black text-lg sm:text-xl text-primary dark:text-white whitespace-nowrap">${item.price.toFixed(2)}</span>
                            {inCart ? (
                              <div className="flex items-center bg-slate-50 dark:bg-gray-700 rounded-2xl p-0.5 sm:p-1 border border-slate-100 dark:border-gray-600">
                                <button onClick={handleRemove} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-primary"><Minus size={16} /></button>
                                <span className="text-sm sm:text-base font-black w-6 sm:w-8 text-center">{totalQuantity}</span>
                                <button onClick={handleAdd} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-primary"><Plus size={16} /></button>
                              </div>
                            ) : (
                              <button
                                onClick={handleAdd}
                                className="bg-primary hover:bg-[#3d5460] text-white font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                              >
                                <Plus size={14} /> Agregar
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-100 dark:bg-gray-700 rounded-2xl overflow-hidden border border-gray-50 dark:border-gray-600 shadow-inner">
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-400 font-medium">No hay productos en esta categoría todavía.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Cart Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-50 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-primary text-white flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                    <ShoppingBag size={18} /> Tu Orden
                  </h3>
                  {cartCount > 0 && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">En marcha</span>}
                </div>

                <div className="p-6 space-y-6">
                  {cartCount > 0 ? (
                    <>
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        {context?.cart.map(item => (
                          <div key={item.uuid} className="flex justify-between items-start gap-3">
                            <div className="flex gap-3">
                              <span className="font-black text-primary text-sm min-w-[20px]">{item.quantity}x</span>
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-charcoal dark:text-white leading-tight">{item.product.name}</p>
                                <button onClick={() => context.removeFromCart(item.uuid)} className="text-[10px] text-red-400 font-bold hover:underline flex items-center gap-1">
                                  <Trash2 size={10} /> Eliminar
                                </button>
                              </div>
                            </div>
                            <span className="text-sm font-black text-charcoal dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <hr className="border-dashed border-gray-200 dark:border-gray-700" />
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-500 font-medium">
                          <span>Subtotal</span>
                          <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500 font-medium">
                          <span>Servicio Fila</span>
                          <span>$0.50</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-black text-primary dark:text-white pt-2 tracking-tighter">
                          <span>Total</span>
                          <span>${(cartTotal + 0.5).toFixed(2)}</span>
                        </div>
                      </div>
                      <Link to="/checkout" className="w-full bg-secondary hover:bg-[#5CE5A3] text-charcoal font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 group active:scale-95">
                        Confirmar Pedido
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </>
                  ) : (
                    <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 opacity-40">
                      <ShoppingBag size={48} className="text-slate-300" />
                      <p className="text-sm font-bold text-slate-400">Tu carrito está vacío</p>
                    </div>
                  )}
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pt-2">
                    Pedí sin fila, retirás cuando esté listo.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Floating Cart */}
      <div className={`fixed bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-2xl lg:hidden z-50 transition-transform ${cartCount > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex gap-4 items-center">
          <div className="flex-grow">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total estimado</p>
            <p className="text-2xl font-black text-primary dark:text-white tracking-tighter">${(cartTotal + 0.5).toFixed(2)}</p>
          </div>
          <Link to="/checkout" className="bg-secondary text-charcoal font-black py-3.5 px-8 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-3">
            Ver Orden
            <span className="bg-charcoal/10 px-2 py-0.5 rounded-md text-xs backdrop-blur-sm">{cartCount}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
