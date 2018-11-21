import { fixRoute } from './tools';

describe('Tools tests', () => {
  it('Should add third point between two existing ones', () => {
    const input = [
      {
        lat: 1,
        lng: 2,
      },
      {
        lat: 2,
        lng: 4,
      },
    ];

    const result = fixRoute(input, 1);

    expect(result.length).toBe(3);
    expect(result).toEqual([
      {
        lat: 1,
        lng: 2,
      },
      {
        lat: 1.5,
        lng: 3,
      },
      {
        lat: 2,
        lng: 4,
      },
    ]);
  });

  it('Should add third point between two existing ones', () => {
    const input = [
      {
        lat: 1,
        lng: 1,
      },
      {
        lat: 2,
        lng: 2,
      },
      {
        lat: 3,
        lng: 3,
      },
    ];

    const result = fixRoute(input, 10);
    expect(result.length).toBe(23);
  });
});
