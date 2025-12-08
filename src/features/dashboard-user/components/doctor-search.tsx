// //src\features\dashboard-user\components\doctor-search.tsx
// "use client";

// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search, MapPin, Filter } from "lucide-react";
// import { motion } from "framer-motion";

// export function DoctorSearchSection() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Card className="p-6 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 border-none shadow-lg">
//         <div className="space-y-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
//               Encuentra tu doctor ideal
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               Busca por especialidad, nombre o ubicación
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
//             {/* Búsqueda principal */}
//             <div className="md:col-span-5 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Buscar doctor o especialidad..."
//                 className="pl-10 h-12 bg-white dark:bg-slate-900"
//               />
//             </div>

//             {/* Especialidad */}
//             <div className="md:col-span-3">
//               <Select>
//                 <SelectTrigger className="h-12 bg-white dark:bg-slate-900">
//                   <SelectValue placeholder="Especialidad" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="medicina_general">
//                     Medicina General
//                   </SelectItem>
//                   <SelectItem value="cardiologia">Cardiología</SelectItem>
//                   <SelectItem value="pediatria">Pediatría</SelectItem>
//                   <SelectItem value="dermatologia">Dermatología</SelectItem>
//                   <SelectItem value="ginecologia">Ginecología</SelectItem>
//                   <SelectItem value="traumatologia">Traumatología</SelectItem>
//                   <SelectItem value="oftalmologia">Oftalmología</SelectItem>
//                   <SelectItem value="neurologia">Neurología</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Ubicación */}
//             <div className="md:col-span-3 relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Ubicación"
//                 defaultValue="Huauchinango, Puebla"
//                 className="pl-10 h-12 bg-white dark:bg-slate-900"
//               />
//             </div>

//             {/* Botón de búsqueda */}
//             <div className="md:col-span-1">
//               <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700">
//                 <Search className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>

//           {/* Filtros rápidos */}
//           <div className="flex flex-wrap gap-2">
//             <Button variant="outline" size="sm" className="rounded-full">
//               <Filter className="h-3 w-3 mr-2" />
//               Disponible hoy
//             </Button>
//             <Button variant="outline" size="sm" className="rounded-full">
//               Acepta mi seguro
//             </Button>
//             <Button variant="outline" size="sm" className="rounded-full">
//               Mejor valorados
//             </Button>
//             <Button variant="outline" size="sm" className="rounded-full">
//               Menos de 5 km
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </motion.div>
//   );
// }
