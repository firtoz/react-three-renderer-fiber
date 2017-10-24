/**
 * A property updater function.
 * @param {TInstance} instance The host instance.
 * @param {TPropType} newValue A value to set for the property.
 * @param {PropertyUpdater.TProps} oldProps What the properties of the element were before the update.
 * @param {TProps} newProps What the current properties of the element are.
 *
 * @type {function (instance: TInstance,
 *               newValue: TPropType,
 *               oldProps: TProps,
 *               newProps: TProps): number}
 */
export type PropertyUpdater< //
  /**
   * The property types for the host instance.
   * @type ReactThreeRendererDescriptor.TProps
   */
  TProps,
  /**
   * The instance type to be created and updated
   * @type ReactThreeRendererDescriptor.TInstance
   */
  TInstance,
  /**
   * @typedef {any} TPropType
   * @type TPropType
   * The property type to update.
   */
  TPropType> = (instance: TInstance,
                newValue: TPropType,
                oldProps: TProps,
                newProps: TProps) => void;
