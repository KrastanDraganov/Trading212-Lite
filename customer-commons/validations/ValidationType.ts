// export type ValidationT =
// 	| {
// 			passed: true;
// 	  }
// 	| {
// 			passed: false;
// 			errorType: string;
// 	  };

export type ValidationT = {
	passed: boolean;
	errorType?: string[];
};
