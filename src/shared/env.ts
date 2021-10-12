export const isDev = process.argv.includes("--dev");

export const isMain = !(process && (process as any).type === 'renderer');
