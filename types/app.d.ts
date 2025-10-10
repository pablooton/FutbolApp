interface Team{
    id: number;
    name: string;
    location: {
        city: string;
        country: string;
    };
    stadium:{
        name:string;
        capacity:number;

    };
    
    logo:string;
}