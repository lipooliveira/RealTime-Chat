import { describe,it,expect } from 'vitest'; import { profit } from '../src/server/services/orders.js';
describe('cálculos do pedido',()=>{it('calcula lucro e margem',()=>expect(profit(4500,3999)).toEqual({grossProfit:501,margin:11.133333333333333}));it('não aceita margem para preço zero',()=>expect(profit(0,10).margin).toBe(0));});
