export interface PrototypeConfig {
  id: string;
  hideGlobalNav?: boolean;
  hideGlobalFooter?: boolean;
}

/**
 * Global control for prototype-specific layout customization.
 * Default behavior is to show global navbar and footer for all prototypes.
 */
export const prototypeConfigs: Record<string, PrototypeConfig> = {
  "market-os": {
    id: "market-os",
    hideGlobalNav: true,
    hideGlobalFooter: true,
  },
  // Add other prototypes here as needed
};

export function getPrototypeConfig(id: string): PrototypeConfig | undefined {
  return prototypeConfigs[id];
}
