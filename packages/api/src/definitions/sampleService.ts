import {
    backendEndpointImplementation,
    frontendEndpointImplementation,
    IEndpointDefiniton,
    IService,
} from "../common/index";

interface ISampleEndpoints extends IService {
    getSampleData: IEndpointDefiniton<{ label: string }, { label: string }>;
}

export const SampleService: ISampleEndpoints = {
    getSampleData: {
        backend: backendEndpointImplementation<{ label: string }, { label: string }>(),
        endpoint: "/sample-endpoint",
        frontend: frontendEndpointImplementation("/sample-endpoint"),
        method: "get",
    },
};
