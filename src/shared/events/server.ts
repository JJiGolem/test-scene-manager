const enum EDimensionProc {
  RequestReturnInZeroDimension = 'server.dimensions.requestReturnInZeroDimension',
  RequestNonZeroDimension = 'server.dimensions.requestNonZeroDimension'
}

declare namespace ServerProc {
  export import Dimension = EDimensionProc;
}