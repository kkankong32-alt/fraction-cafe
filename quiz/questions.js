(function(root){
  'use strict';
  const questions=[
    {id:1,type:'initial',title:'컵의 눈금을 정해요',prompt:'전체를 똑같이 나눈 부분의 수를 나타내는 수는 무엇인가요? 초성 힌트 ㅂㅁ을 보고 두 글자로 쓰세요.',hint:'ㅂㅁ',answer:'분모',answerText:'분모',explanation:'분모는 전체를 똑같이 나눈 부분의 수를 나타냅니다. 분모가 8이면 전체를 같은 크기의 8부분으로 나눈 것입니다.',source:'수학 12~13쪽 / 수학익힘 9~10쪽',image:'milk.png',scene:'같은 크기로 나누기',visual:{kind:'divisions',d:8}},
    {id:2,type:'ox',title:'계산 약속을 확인해요',prompt:'분모가 같은 두 분수를 더할 때에는 분모끼리 더하고, 분자끼리도 더합니다. 이 설명이 맞으면 O, 틀리면 X를 고르세요.',options:['O','X'],answer:1,answerText:'X',explanation:'분모가 같은 분수의 덧셈에서는 분모는 그대로 쓰고 분자끼리 더합니다. 나눈 한 조각의 크기는 바뀌지 않기 때문입니다.',source:'수학 13쪽 / 수학익힘 10~11쪽',image:'host.png',scene:'분수카페의 계산 약속'},
    {id:3,type:'choice',title:'레몬에이드를 만들어요',prompt:'탄산수 {3/8}컵과 레몬 베이스 {2/8}컵을 합쳤습니다. 합친 양은 몇 컵인가요?',options:['{5/16}컵','{1/8}컵','{5/8}컵','{6/8}컵'],answer:2,answerText:'5/8컵',explanation:'{3/8}+{2/8}는 {1/8}이 3개와 2개, 모두 5개입니다. 따라서 합친 양은 {5/8}컵입니다. 분모 8은 그대로 씁니다.',source:'수학 12~13쪽 / 수학익힘 10~11쪽',image:'lemon-drink.png',scene:'두 재료를 한 컵에',visual:{kind:'pair',d:8,a:3,b:2}},
    {id:4,type:'short',title:'한 컵을 넘었어요',prompt:'{4/7}컵과 {5/7}컵을 합치면 한 컵보다 많아집니다. 다음 식의 □에 들어갈 자연수를 쓰세요.',equation:'{4/7} + {5/7} = {1 ?/7}',answer:'2',answerText:'2',explanation:'{4/7}+{5/7}={9/7}입니다. {7/7}은 1이므로 {9/7}={1 2/7}입니다. 따라서 □에 들어갈 수는 2입니다.',source:'수학 13쪽 / 수학익힘 10쪽',image:'milk.png',scene:'가득 찬 한 컵은 1'},
    {id:5,type:'choice',title:'단체 주문을 준비해요',prompt:'우유 {1 3/5} L와 {2 4/5} L를 합쳤습니다. 우유는 모두 몇 L인가요?',options:['{3 2/5} L','{4 2/5} L','{3 7/10} L','{4 1/5} L'],answer:1,answerText:'4와 2/5 L',explanation:'자연수 부분의 합은 1+2=3이고, 분수 부분의 합은 {3/5}+{4/5}={7/5}={1 2/5}입니다. 모두 합하면 {4 2/5} L입니다.',source:'수학 14~15쪽 / 수학익힘 12~13쪽',image:'milk.png',scene:'온전한 양과 분수 부분'},
    {id:6,type:'choice',title:'사용한 만큼 덜어 내요',prompt:'딸기 베이스 {7/9}컵 중에서 {2/9}컵을 사용했습니다. 남은 양은 몇 컵인가요?',options:['{5/7}컵','{9/9}컵','{5/18}컵','{5/9}컵'],answer:3,answerText:'5/9컵',explanation:'{7/9}-{2/9}는 {1/9} 7개에서 2개를 덜어 내는 것입니다. 5개가 남으므로 {5/9}컵입니다.',source:'수학 16~17쪽 / 수학익힘 14~15쪽',image:'strawberry.png',scene:'남은 재료 살펴보기',visual:{kind:'stock',d:9,a:7}},
    {id:7,type:'short',title:'새 병 하나를 나눠요',prompt:'우유 3 L 중에서 {2/5} L를 사용했습니다. 남은 양을 나타낸 식의 □에 들어갈 자연수를 쓰세요.',equation:'3 − {2/5} = {2 ?/5}',answer:'3',answerText:'3',explanation:'3을 {2 5/5}로 바꾸면 {2 5/5}-{2/5}={2 3/5}입니다. 따라서 □에 들어갈 수는 3입니다.',source:'수학 20~21쪽 / 수학익힘 18~19쪽',image:'milk.png',scene:'온전한 1을 같은 크기의 5부분으로'},
    {id:8,type:'choice',title:'재고를 정확히 계산해요',prompt:'초코 베이스 {3 5/6}컵 중에서 {1 2/6}컵을 사용했습니다. 남은 양으로 알맞은 것을 고르세요.',options:['{2 3/6}컵','{2 7/6}컵','{1 3/6}컵','{2 3/12}컵'],answer:0,answerText:'2와 3/6컵',explanation:'자연수 부분은 3−1=2, 분수 부분은 {5/6}−{2/6}={3/6}입니다. 따라서 {2 3/6}컵이 남습니다. 같은 양을 {2 1/2}컵으로 나타내어도 맞습니다.',source:'수학 18~19쪽 / 수학익힘 16~17쪽',image:'chocolate.png',scene:'자연수 부분끼리, 분수 부분끼리'},
    {id:9,type:'sequence',title:'계산 과정을 이어 보세요',prompt:'{3 1/5}−{1 4/5}를 계산하려고 합니다. 먼저 자연수에서 1만큼을 분수로 바꾸고, 자연수 부분끼리와 분수 부분끼리 계산한 뒤, 대분수로 정리하세요. 아래 계산 카드를 올바른 순서로 누르세요.',options:['{1 2/5}','{2 6/5} − {1 4/5}','(2 − 1) + ({6/5} − {4/5})','1 + {2/5}'],answer:[1,2,3,0],answerText:'B → C → D → A',explanation:'먼저 {3 1/5}에서 자연수 1을 {5/5}로 바꾸면 {2 6/5}가 됩니다. B → C → D → A 순서로 계산하면 {1 2/5}입니다. 빼는 수와 빼어지는 수의 분자를 거꾸로 빼면 안 됩니다.',source:'수학 22~23쪽, 29쪽 / 수학익힘 20~21쪽',image:'host.png',scene:'온전한 1을 바꾸고 차례대로 계산'},
    {id:10,type:'short',title:'카페 입장 전 마지막 주문!',prompt:'우유가 4 L 있습니다. 첫 번째 주문에 {1 3/8} L, 두 번째 주문에 {1 2/8} L를 사용했습니다. 두 주문을 모두 만든 뒤 남은 우유는 {1 ?/8} L입니다. □에 들어갈 자연수를 쓰세요.',answer:'3',answerText:'3',explanation:'사용한 우유는 {1 3/8}+{1 2/8}={2 5/8} L입니다. 남은 우유는 4−{2 5/8}={3 8/8}−{2 5/8}={1 3/8} L이므로 □는 3입니다.',source:'수학 24~25쪽 / 수학익힘 19쪽',image:'milk.png',scene:'사용한 양을 합하고 전체에서 빼기'}
  ];
  const typeNames={choice:'선택형',short:'단답형',ox:'OX문제',sequence:'순서완성형',initial:'초성퀴즈형'};
  function normalize(value){return String(value??'').normalize('NFKC').replace(/\s+/g,'').trim()}
  function grade(q,value){
    if(q.type==='sequence')return Array.isArray(value)&&value.length===q.answer.length&&value.every((n,i)=>n===q.answer[i]);
    if(q.type==='choice'||q.type==='ox')return Number.isInteger(value)&&value===q.answer;
    if(q.type==='short'){const v=normalize(value);return /^\d+$/.test(v)&&Number(v)===Number(q.answer)}
    return normalize(value)===q.answer;
  }
  const passed=(score)=>Number.isInteger(score)&&score>=7&&score<=10;
  const api={questions,typeNames,grade,passed};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CafeQuiz=api;
})(typeof window!=='undefined'?window:globalThis);
