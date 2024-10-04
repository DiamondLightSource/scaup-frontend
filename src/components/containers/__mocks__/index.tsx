export const setLocationMock = vi.fn();
setLocationMock.mockReset();

export const useChildLocationManager = () => setLocationMock;
