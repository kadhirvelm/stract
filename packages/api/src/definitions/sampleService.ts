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
        backend: {
            endpoint: "/sample-endpoint",
            implementation: backendEndpointImplementation<{ label: string }, { label: string }>(),
            method: "get",
        },
        frontend: frontendEndpointImplementation("/sample-endpoint"),
    },
};
