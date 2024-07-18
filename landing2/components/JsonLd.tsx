import {Thing, WithContext} from "schema-dts";

export function JsonLd<T extends Thing>(props: {data: WithContext<T>}) {
    return (
        <script type="application/ld+json">
            {JSON.stringify(props.data)}
        </script>
    );
}