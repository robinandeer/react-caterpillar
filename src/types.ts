export interface FeatureFlag<NameType> {
  name: NameType;
  description: string;
  active: boolean;
}

export type FeatureGroup<NameType extends string> = {
  [featureName in NameType]: FeatureFlag<NameType>;
};
