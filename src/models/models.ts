export interface IPlanets {
    Planets: IPlanet[],
    status?: string
}

export interface IPlanetResponse {
    Planets: IPlanet[],
    status?: string
}

// export interface IStatus {
//     id: number,
//     status_name?: string,
// }
export interface IPlanetWithBasket {
    fr_id: number
    Planets: IPlanet[]
}
export interface IDefaultResponse {
    description?: string
}

export interface IPlanet {
    description?: string,
    distance?: number,
    gravity?: number,
    id: number,
    image?: string,
    is_delete?:boolean,
    name?: string,
    radius?: number,
    type?:string,
}

export interface IPlanetRequests {
    fr_id: number,
    planet_id: number,
    flight_number?: number,
    planet: IPlanet,
}

export interface IRegisterResponse {
    login: string
    password: string
}

export interface IAuthResponse {
    access_token?: string,
    userid?: number,
    role?: string,
    userName?: string,
    userImage?: string
}

// export interface IUser {
//     id: number,
//     user_name: string,
//     profession?: string,
//     user_login: string,
//     birthday?: string,
//     image_url?: string,
//     password: string,
// }

export interface IFlight {
    id: number,
    ams: string,
    date_create: string,
    date_formation: string,
    date_completion: string,
    user_id: number,
    moder_id: number,
    status: string,
    planets_request: IPlanetRequests[],
    user_login: string,
    moder_login: string,
    result:string
}

export interface IUpdateFlight {
    description?: string
}

export interface IDeletePlanetRequest {
    deleted_planet_request: number,
    status: string,
    description?: string,
}
export interface IUpdatePlanetNumberInRequest {
    planet_id: number,
    command:number,
    fr_id: number,
}

export interface IRequest {
    Flights: IFlight[]
    status?: string
}

export interface IFlightResponse {
    Flights: IFlight[]
    status?: string
}


export const mockPlanets: IPlanet[] = [
    {id: 1, name: 'Сатурн_mock', radius: 3389.5,distance:1200000000,gravity:107, is_delete:false, description: 'Сатурн - шестая планета Солнечной системы, наиболее известная благодаря своим кольцам из льда и камней, которые делают ее уникальной среди других планет. Сатурн также является газовым гигантом с многочисленными спутниками, включая крупнейший - Титан. Несмотря на то, что Сатурн находится на значительном расстоянии от Земли, его потрясающая красота и тайны привлекают учёных и астрономов.', image: 'http://172.20.0.7:9000/amsflights/saturn.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FX6CA7X1DJ38GN22YM8Y%2F20231205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231205T170118Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJGWDZDQTdYMURKMzhHTjIyWU04WSIsImV4cCI6MTcwMTc5ODkyMSwicGFyZW50IjoibWluaW8ifQ.NbiBb7LvrXlW3qfJ9UxDytv3gx4pEYluvZZ0L4aD2PFuSVsXn9IpF-eTmOa4EvFsxyJ2NFtJQUp7EpJ8iGDOtQ&X-Amz-SignedHeaders=host&versionId=12ab384c-8992-4535-b6fd-a19e8030838c&X-Amz-Signature=88d2b058208a2325e498ac94ec5c58932d4ecbd0f57db28e52949c845b1bd2f2'},
    {id: 2, name: 'Марс_mock', radius: 3389.5,distance:55000000,gravity:37, is_delete:false, description: 'Марс - четвёртая планета от Солнца и ближайшая к Земле внешняя планета. Он известен своим красноватым оттенком, который обусловлен наличием оксида железа на его поверхности. Марс также имеет атмосферу и полярные капюшоны, а исследование этой планеты помогает ученым лучше понять процессы, протекающие на Земле.', image: 'http://172.20.0.7:9000/amsflights/mars.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FX6CA7X1DJ38GN22YM8Y%2F20231205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231205T170050Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJGWDZDQTdYMURKMzhHTjIyWU04WSIsImV4cCI6MTcwMTc5ODkyMSwicGFyZW50IjoibWluaW8ifQ.NbiBb7LvrXlW3qfJ9UxDytv3gx4pEYluvZZ0L4aD2PFuSVsXn9IpF-eTmOa4EvFsxyJ2NFtJQUp7EpJ8iGDOtQ&X-Amz-SignedHeaders=host&versionId=622c7aa6-32c6-4ae6-9f69-97b5232bc574&X-Amz-Signature=500c05a25daab84a6ad492a6661071d127207890d3f9d8a5e57c7218e8022909'},
    {id: 3, name: 'Луна_mock', radius: 1737.1,distance:384400,gravity:16.6, is_delete:false, description: 'Луна - естественный спутник Земли, являющийся единственным небесным телом, на котором человек уже побывал. Она имеет покрытую кратерами поверхность и орбитирует вокруг Земли, повышая красоту ночного неба.', image: 'http://172.20.0.7:9000/amsflights/moon.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=FX6CA7X1DJ38GN22YM8Y%2F20231205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231205T165820Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJGWDZDQTdYMURKMzhHTjIyWU04WSIsImV4cCI6MTcwMTc5ODkyMSwicGFyZW50IjoibWluaW8ifQ.NbiBb7LvrXlW3qfJ9UxDytv3gx4pEYluvZZ0L4aD2PFuSVsXn9IpF-eTmOa4EvFsxyJ2NFtJQUp7EpJ8iGDOtQ&X-Amz-SignedHeaders=host&versionId=56364c60-bbca-44ef-9bef-45b9e81d3d84&X-Amz-Signature=afd8796233f875edb39bb49d9c54dea87f8dfa2cfc4fd61e129256a6876af3c1'},
]


export const defaultImage: string = `public/defaultava.webp`