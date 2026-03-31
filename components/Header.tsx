import { ComponentType, FC, PropsWithChildren } from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";

const HeaderNavigationCompat =
  HeaderNavigation as unknown as ComponentType<PropsWithChildren<{}>>;

export const Header: FC = () => {
  return (
    <HeaderNavigationCompat>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
          <StyledLink href="/">pandoc-nextjs-server</StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigationCompat>
  );
};
