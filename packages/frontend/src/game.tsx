import * as React from "react";
import { SampleService } from "@stract/api";

export class Game extends React.PureComponent {
    public async componentDidMount() {
        const res = await SampleService.getSampleData.frontend({ label: "string" });
        // eslint-disable-next-line no-console
        console.log(res);
    }

    public render() {
        return <div>Hello world!</div>;
    }
}
