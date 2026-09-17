import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const products = [[100,899,1000],[300,1490,1700],[500,1899,2200],[1000,3999,4500],[2000,6199,7000],[3000,9999,11000],[5000,14350,16000],[10000,26470,28000]];
async function main(){ for(const [quantity,supplierCost,salePrice] of products) await prisma.product.upsert({where:{id:`seed-${quantity}`},update:{},create:{id:`seed-${quantity}`,name:`${quantity.toLocaleString('pt-BR')} seguidores 🇺🇸`,description:'Seguidores para Instagram. Não solicitamos senha ou códigos de acesso.',category:'Seguidores Instagram 🇺🇸',quantity,supplierCost,salePrice,sortOrder:quantity}}); }
main().finally(()=>prisma.$disconnect());
