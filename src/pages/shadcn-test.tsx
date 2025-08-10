import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ShadcnTestPage() {
  return (
    <div className="container mx-auto space-y-8 p-8">
      <h1 className="text-3xl font-bold">shadcn/ui コンポーネントテスト</h1>

      {/* Button */}
      <Card>
        <CardHeader>
          <CardTitle>Button コンポーネント</CardTitle>
          <CardDescription>様々なバリエーションのボタン</CardDescription>
        </CardHeader>
        <CardContent className="space-x-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>フォーム要素</CardTitle>
          <CardDescription>Input、Label、Select、Textarea</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="framework">Framework</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="フレームワークを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="メッセージを入力してください" />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>テーブル</CardTitle>
          <CardDescription>データ表示用のテーブル</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名前</TableHead>
                <TableHead>年齢</TableHead>
                <TableHead>職業</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>田中太郎</TableCell>
                <TableCell>25</TableCell>
                <TableCell>エンジニア</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>佐藤花子</TableCell>
                <TableCell>30</TableCell>
                <TableCell>デザイナー</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>鈴木一郎</TableCell>
                <TableCell>28</TableCell>
                <TableCell>プロダクトマネージャー</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
