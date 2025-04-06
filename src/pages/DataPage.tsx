
import { PeopleDataTable } from "@/components/data/PeopleDataTable";

const DataPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">People Data</h1>
        <p className="text-muted-foreground mt-1">
          View all contact records.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PeopleDataTable initialPageSize={5} />
      </div>
    </div>
  );
};

export default DataPage;
