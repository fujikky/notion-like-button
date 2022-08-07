export type Layout = "full-page" | "center-peek" | "side-peek";

export type RuntimeMessageRequest =
  | {
      readonly message: "init";
      readonly userId: string;
      readonly url: string;
    }
  | {
      readonly message: "createLike";
      readonly userId: string;
      readonly url: string;
    }
  | {
      readonly message: "deleteLike";
      readonly userId: string;
      readonly url: string;
    };

export type TabMessageRequest =
  | {
      readonly message: "showLikeButton";
      readonly isLiked: boolean;
      readonly likeCount: number;
      readonly layout: Layout;
      readonly url: string;
    }
  | {
      readonly message: "updateLikeButton";
      readonly isLiked: boolean;
      readonly likeCount: number;
      readonly layout: Layout;
      readonly url: string;
    }
  | {
      readonly message: "revertLikeButton";
    }
  | {
      readonly message: "hideLikeButton";
    };

export type SettingsValues = {
  readonly apiToken: string | undefined;
  readonly likeProp: string | undefined;
};
