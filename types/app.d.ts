interface Team{
    id: string;
    name: string;
    location: {
        city: string;
        country: string;
    };
    stadium:{
        name:string;
        capacity:number;

    };
    
    logo?:string;
}
type TeamSnapshotData = {
  name: string;
  location: {
    city: string;
    country: string;
  };
  stadium: {
    name: string;
    capacity: number;
  };
  logo?: string;
};

type PlayerPosition = "Goalkeeper"|"Defender" | "Midfielder" | "Forward";
type PlayerPositionLabel = 'GK' | 'DF' | 'MF' | 'FW';

interface Player{
    id:string;
    name: string;
    position:PlayerPosition;
    teamId?:typeof Team[" id "];
    logo?: string;
}
type PlayerSnapshotData = {
  name: string;
  position: PlayerPosition;
  teamId?: string;
  logo?: string;
};