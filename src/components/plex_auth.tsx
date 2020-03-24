import * as React from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

interface Props {
}

interface State {
    showPopout: boolean;
}

export default class PlexAuthentication extends React.Component<Props, State> {
    private ticker?: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);
        this.ticker = undefined;
        this.state = {
            showPopout: false
        };
    }

    async componentDidMount() {
        const uuid = uuidv4();
        const plex = axios.create({
            baseURL: 'https://plex.tv/',
            headers: {
                'X-Plex-Device': 'Web',
                'X-Plex-Device-Name': 'Syncarr',
                'X-Plex-Product': 'Syncarr',
                'X-Plex-Version': '0.0.1',
                'X-Plex-Platform-Version': '',
                'X-Plex-Client-Identifier': uuid,
                'X-Plex-Platform': 'Firefox',
            }
        });
        let result = await plex.post('/api/v2/pins?strong=true');
        const features = 'width=800, height=500, left=300, top=200';
        const externalWindow = window.open(
            `https://app.plex.tv/auth/#!?clientID=${uuid}&code=${result.data.code}`, '', features);
        this.ticker = setInterval(async () => {
            result = await plex.get(`https://plex.tv/api/v2/pins/${result.data.id}`);
            if (result && result.data && result.data.authToken) {
                if (externalWindow) {
                    externalWindow.close();
                }

                if (this.ticker) {
                    clearInterval(this.ticker);
                }

                console.log(result.data.authToken);
            }
        }, 2000);
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}