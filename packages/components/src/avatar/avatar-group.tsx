import { compact, cx } from "@chakra-ui/utils"
import { cloneElement } from "react"
import { getValidChildren } from "../shared/children"
import {
  HTMLChakraProps,
  SystemProps,
  SystemStyleObject,
  ThemingProps,
  chakra,
  forwardRef,
  omitThemingProps,
  useMultiStyleConfig,
} from "../system"
import { baseStyle } from "./avatar"

interface AvatarGroupOptions {
  /**
   * The children of the avatar group.
   *
   * Ideally should be `Avatar` and `MoreIndicator` components
   */
  children: React.ReactNode
  /**
   * The space between the avatars in the group.
   * @default "-0.75rem"
   * @type SystemProps["margin"]
   */
  spacing?: SystemProps["margin"]
  /**
   * The maximum number of visible avatars
   */
  max?: number
}

export interface AvatarGroupProps
  extends AvatarGroupOptions,
    Omit<HTMLChakraProps<"div">, "children">,
    ThemingProps<"Avatar"> {}

/**
 * AvatarGroup displays a number of avatars grouped together in a stack.
 */
export const AvatarGroup = forwardRef<AvatarGroupProps, "div">(
  function AvatarGroup(props, ref) {
    const styles = useMultiStyleConfig("Avatar", props)

    const {
      children,
      borderColor,
      max,
      spacing = "-0.75rem",
      borderRadius = "full",
      ...rest
    } = omitThemingProps(props)

    const validChildren = getValidChildren(children)

    /**
     * get the avatars within the max
     */
    const childrenWithinMax =
      max != null ? validChildren.slice(0, max) : validChildren

    /**
     * get the remaining avatar count
     */
    const excess = max != null ? validChildren.length - max : 0

    /**
     * Reversing the children is a great way to avoid using zIndex
     * to overlap the avatars
     */
    const reversedChildren = childrenWithinMax.reverse()

    const clones = reversedChildren.map((child, index) => {
      const isFirstAvatar = index === 0

      const childProps = {
        marginEnd: isFirstAvatar ? 0 : spacing,
        size: props.size,
        borderColor: child.props.borderColor ?? borderColor,
        showBorder: true,
      }

      return cloneElement(child, compact(childProps))
    })

    const groupStyles: SystemStyleObject = {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      flexDirection: "row-reverse",
      ...styles.group,
    }

    const excessStyles: SystemStyleObject = {
      borderRadius,
      marginStart: spacing,
      ...baseStyle,
      ...styles.excessLabel,
    }

    return (
      <chakra.div
        ref={ref}
        role="group"
        __css={groupStyles}
        {...rest}
        className={cx("chakra-avatar__group", props.className)}
      >
        {excess > 0 && (
          <chakra.span className="chakra-avatar__excess" __css={excessStyles}>
            {`+${excess}`}
          </chakra.span>
        )}
        {clones}
      </chakra.div>
    )
  },
)

AvatarGroup.displayName = "AvatarGroup"
