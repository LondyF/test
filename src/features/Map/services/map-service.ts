import request from '@src/utils/request';

export const fetchDirections = async (
  apuId: number,
  latVan: number,
  latTot: number,
  lngVan: number,
  lngTot: number,
) =>
  await request({
    method: 'POST',
    url: 'app-rn1/gAfstanden',
    storeInCache: false,
    data: {
      apuId,
      latVan,
      latTot,
      lngVan,
      lngTot,
    },
  });
