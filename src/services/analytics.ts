export const measurementIds=['G-DC7N6KQBG0','G-5YW0T2C109'];
type AnalyticsWindow=Window&{dataLayer?:unknown[];gtag?:(...args:unknown[])=>void};
export function initAnalytics(){const w=window as AnalyticsWindow;if(w.gtag)return;w.dataLayer=[];w.gtag=function(){w.dataLayer!.push(arguments)};w.gtag('js',new Date());measurementIds.forEach(id=>w.gtag!('config',id,{send_page_view:true}));const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+measurementIds[0];document.head.append(s)}
export function event(name:string,data:Record<string,string|number|boolean>={}){(window as AnalyticsWindow).gtag?.('event',name,data)}
