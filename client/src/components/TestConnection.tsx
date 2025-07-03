import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { users, auth } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();

  const runTests = async () => {
    setLoading(true);
    const results: string[] = [];

    try {
      // Test 1: Get all users
      results.push("🔄 Testing database connection...");
      const usersData = await users.getAll();
      results.push(`✅ Database connected! Found ${usersData.length} users`);

      // Test 2: Test login with sample account
      results.push("🔄 Testing login functionality...");
      const loginResult = await auth.login("admin@smartcare.com", "admin123");
      results.push(`✅ Login successful! User: ${loginResult.user.name}`);

      results.push("🎉 All tests passed! Database is working correctly.");
      
      toast({
        title: "Success",
        description: "Database connection and API are working properly!"
      });

    } catch (error) {
      results.push(`❌ Error: ${error}`);
      toast({
        title: "Error",
        description: "Some tests failed. Check the results.",
        variant: "destructive"
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runTests} disabled={loading}>
          {loading ? "Running Tests..." : "Test Database Connection"}
        </Button>
        
        {testResults.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm">
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestConnection;