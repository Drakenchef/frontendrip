export interface IPlanets {
    Planets: IPlanet[],
    status: string
}

export interface IPlanetResponse {
    Planet: IPlanet,
    status: string
}

export interface IStatus {
    id: number,
    status_name: string,
}

export interface IPlanet {
    id: number,
    name?: string,
    radius?: number,
    distance?: number,
    gravity?: number,
    is_delete?:boolean,
    description?: string,
    image?: string,
}

export const mockPlanets: IPlanet[] = [
    {id: 1, name: 'Сатурн_mock', radius: 3389.5,distance:1200000000,gravity:107, is_delete:false, description: 'Сатурн - шестая планета Солнечной системы, наиболее известная благодаря своим кольцам из льда и камней, которые делают ее уникальной среди других планет. Сатурн также является газовым гигантом с многочисленными спутниками, включая крупнейший - Титан. Несмотря на то, что Сатурн находится на значительном расстоянии от Земли, его потрясающая красота и тайны привлекают учёных и астрономов.', image: 'http://127.0.0.1:9000/amsflights/earth.jpg'},
    {id: 2, name: 'Марс_mock', radius: 3389.5,distance:55000000,gravity:37, is_delete:false, description: 'Марс - четвёртая планета от Солнца и ближайшая к Земле внешняя планета. Он известен своим красноватым оттенком, который обусловлен наличием оксида железа на его поверхности. Марс также имеет атмосферу и полярные капюшоны, а исследование этой планеты помогает ученым лучше понять процессы, протекающие на Земле.', image: 'http://127.0.0.1:9000/amsflights/earth.jpg'},
    {id: 3, name: 'Луна_mock', radius: 1737.1,distance:384400,gravity:16.6, is_delete:false, description: 'Луна - естественный спутник Земли, являющийся единственным небесным телом, на котором человек уже побывал. Она имеет покрытую кратерами поверхность и орбитирует вокруг Земли, повышая красоту ночного неба.', image: 'http://127.0.0.1:9000/amsflights/earth.jpg'},
]
